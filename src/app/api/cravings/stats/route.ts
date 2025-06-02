import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    const client = await clientPromise;
    const db = client.db('quitt');
    
    const userId = new ObjectId(decoded.userId);

    // Date calculations
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Basic statistics
    const cravingsToday = await db.collection('cravings').countDocuments({
      userId,
      timestamp: { $gte: todayStart, $lte: todayEnd }
    });

    const cravingsThisWeek = await db.collection('cravings').countDocuments({
      userId,
      timestamp: { $gte: sevenDaysAgo }
    });

    // Average intensity today
    const intensityPipeline = [
      { $match: { userId, timestamp: { $gte: todayStart, $lte: todayEnd } } },
      { $group: { _id: null, avgIntensity: { $avg: '$intensity' } } }
    ];
    
    const intensityResult = await db.collection('cravings').aggregate(intensityPipeline).toArray();
    const avgIntensityToday = intensityResult[0]?.avgIntensity || 0;

    // Most common triggers this week
    const triggerPipeline = [
      { $match: { userId, timestamp: { $gte: sevenDaysAgo } } },
      { $unwind: '$triggers' },
      { $group: { _id: '$triggers', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ];
    
    const topTriggers = await db.collection('cravings').aggregate(triggerPipeline).toArray();

    // Craving intensity trend (last 7 days)
    const trendPipeline = [
      { $match: { userId, timestamp: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
          },
          avgIntensity: { $avg: '$intensity' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ];
    
    const intensityTrend = await db.collection('cravings').aggregate(trendPipeline).toArray();

    // Time pattern analysis
    const timePatternPipeline = [
      { $match: { userId, timestamp: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $hour: '$timestamp' },
          count: { $sum: 1 },
          avgIntensity: { $avg: '$intensity' }
        }
      },
      { $sort: { '_id': 1 } }
    ];
    
    const timePattern = await db.collection('cravings').aggregate(timePatternPipeline).toArray();

    return NextResponse.json({
      cravingsToday,
      cravingsThisWeek,
      avgIntensityToday: Math.round(avgIntensityToday * 10) / 10,
      topTriggers: topTriggers.map(t => ({ trigger: t._id, count: t.count })),
      intensityTrend: intensityTrend.map(d => ({
        date: d._id,
        avgIntensity: Math.round(d.avgIntensity * 10) / 10,
        count: d.count
      })),
      timePattern: timePattern.map(t => ({
        hour: t._id,
        count: t.count,
        avgIntensity: Math.round(t.avgIntensity * 10) / 10
      }))
    });
  } catch (error) {
    console.error('Error fetching craving stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 