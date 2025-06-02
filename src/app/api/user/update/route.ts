import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

export async function PUT(request: NextRequest) {
  try {
    // Get the authorization header
    const authorization = request.headers.get('authorization');
    let token = null;
    
    if (authorization?.startsWith('Bearer ')) {
      token = authorization.substring(7);
    } else {
      // Try to get from localStorage (sent in body or check cookies)
      const authHeader = request.headers.get('cookie');
      if (authHeader) {
        const cookies = authHeader.split(';').map(cookie => cookie.trim());
        const tokenCookie = cookies.find(cookie => cookie.startsWith('token='));
        if (tokenCookie) {
          token = tokenCookie.split('=')[1];
        }
      }
    }

    // For now, we'll get the user data from localStorage that was sent in the request
    // In a real app, you'd verify the JWT token
    const body = await request.json();
    const { firstName, lastName, email, smokingData } = body;

    // Basic validation
    if (!firstName || !lastName || !email || !smokingData) {
      return NextResponse.json(
        { error: 'Alle Felder sind erforderlich' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Ungültige E-Mail-Adresse' },
        { status: 400 }
      );
    }

    // Validate smoking data
    if (
      !smokingData.cigarettesPerDay ||
      !smokingData.smokingStartYear ||
      !smokingData.quitDate ||
      !smokingData.cigarettePrice ||
      !smokingData.cigarettesPerPack ||
      !Array.isArray(smokingData.reasonsToQuit) ||
      smokingData.previousQuitAttempts === undefined ||
      !smokingData.motivationLevel
    ) {
      return NextResponse.json(
        { error: 'Ungültige Rauchdaten' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('quitt');
    
    // For this demo, we'll find the user by email
    // In a real app, you'd decode the JWT to get the user ID
    const user = await db.collection('users').findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Benutzer nicht gefunden' },
        { status: 404 }
      );
    }

    // Update user data
    const updateData = {
      firstName,
      lastName,
      email,
      smokingData: {
        ...smokingData,
        quitDate: new Date(smokingData.quitDate)
      },
      updatedAt: new Date()
    };

    const result = await db.collection('users').updateOne(
      { _id: user._id },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Fehler beim Aktualisieren der Daten' },
        { status: 500 }
      );
    }

    // Return updated user data (without password)
    const updatedUser = await db.collection('users').findOne(
      { _id: user._id },
      { projection: { password: 0 } }
    );

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
} 