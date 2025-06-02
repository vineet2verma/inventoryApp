import { SignJWT, jwtVerify } from 'jose'
import { NextResponse } from 'next/server'
import User from '@/app/api/models/user.model'

export async function POST (req) {
  const { email } = await req.json()

  const user = await User.findOne({ email: email })
  const exp = Math.floor(Date.now() / 1000) + 60 * 15
  const secret = new TextEncoder().encode(process.env.JWT_SECRET)

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const token = await new SignJWT({ userId: user._id.toString() })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(exp)

    .sign(secret)

  return NextResponse.json({ token })
}

export async function PUT (req) {
  try {
    const { token, newPassword } = await req.json()

    console.log('token => ', token)
    console.log('newPassword =>', newPassword)

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    )

    console.log('payload =>  ', payload)

    const userId = payload.userId
    console.log('userId => ', userId)

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: newPassword },
      { new: true }
    )

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { error: 'Invalid or expired token' },
      { status: 401 }
    )
  }
}
