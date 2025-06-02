import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { CravingEntry } from '@/types/user';
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
    
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const days = parseInt(searchParams.get('days') || '30');
    
    const dateFilter = new Date();
    dateFilter.setDate(dateFilter.getDate() - days);

    const cravings = await db.collection('cravings')
      .find({ 
        userId: new ObjectId(decoded.userId),
        timestamp: { $gte: dateFilter }
      })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json(cravings);
  } catch (error) {
    console.error('Error fetching cravings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    const body = await request.json();
    const { intensity, situation, trigger, location, emotion, notes } = body;

    if (!intensity || intensity < 1 || intensity > 10) {
      return NextResponse.json({ error: 'Invalid intensity value' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('quitt');

    const cravingEntry: Partial<CravingEntry> = {
      userId: new ObjectId(decoded.userId),
      intensity,
      timestamp: new Date(),
      situation,
      trigger,
      location,
      emotion,
      notes
    };

    const result = await db.collection('cravings').insertOne(cravingEntry);
    
    const createdCraving = await db.collection('cravings').findOne({ _id: result.insertedId });

    return NextResponse.json(createdCraving, { status: 201 });
  } catch (error) {
    console.error('Error creating craving:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 