import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { hashPassword, generateToken } from '@/lib/auth';
import { RegisterData, User } from '@/types/user';

export async function POST(request: NextRequest) {
  try {
    const body: RegisterData = await request.json();
    const { email, password, firstName, lastName, smokingData } = body;

    // Validate input
    if (!email || !password || !firstName || !lastName || !smokingData) {
      return NextResponse.json(
        { error: 'Alle Felder sind erforderlich' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Ungültige E-Mail-Adresse' },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Passwort muss mindestens 6 Zeichen lang sein' },
        { status: 400 }
      );
    }

    // Validate smoking data
    if (smokingData.cigarettesPerDay <= 0) {
      return NextResponse.json(
        { error: 'Ungültige Anzahl Zigaretten pro Tag' },
        { status: 400 }
      );
    }

    if (smokingData.reasonsToQuit.length === 0) {
      return NextResponse.json(
        { error: 'Bitte wählen Sie mindestens einen Grund zum Aufhören aus' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('quitt');
    const users = db.collection<User>('users');

    // Check if user already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Benutzer mit dieser E-Mail existiert bereits' },
        { status: 409 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const newUser: Omit<User, '_id'> = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      smokingData: {
        ...smokingData,
        quitDate: new Date(smokingData.quitDate),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await users.insertOne(newUser);
    const token = generateToken(result.insertedId.toString());

    // Return user without password
    const userWithoutPassword = {
      _id: result.insertedId,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      smokingData: newUser.smokingData,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    const response = NextResponse.json(
      {
        message: 'Benutzer erfolgreich erstellt',
        user: userWithoutPassword,
      },
      { status: 201 }
    );

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
} 