'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { useParams } from 'next/navigation'

export default function ResetPassword () {
  const router = useRouter()
  const params = useParams()
  const token = params.token
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    let req = await fetch('/api/resetpassword', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token, newPassword: password })
    })

    let resp = await req.json()
    if (resp.success) {
      alert('Password Updated Sucessfully')
      router.push('/signin')
    }

    // Add your API call here to reset the password

    // On success:
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 px-4'>
      <div className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-md'>
        <h2 className='text-2xl font-bold text-center text-gray-800 mb-6'>
          Reset Password
        </h2>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label className='block text-gray-700 font-medium mb-2'>
              Create Password
            </label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <div
                className='absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
          </div>

          <div>
            <label className='block text-gray-700 font-medium mb-2'>
              Confirm Password
            </label>
            <div className='relative'>
              <input
                type={showConfirm ? 'text' : 'password'}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              <div
                className='absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500'
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
          </div>

          <button
            type='submit'
            className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-200'
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  )
}
