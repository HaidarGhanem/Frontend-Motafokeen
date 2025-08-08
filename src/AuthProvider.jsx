import { AuthProvider } from 'react-auth-kit'
import React from 'react'

const AuthProviderWrapper = ({ children }) => {
  return (
    <AuthProvider
      authType={'localstorage'}
      authName={'_auth'}
      cookieDomain={window.location.hostname}
      cookieSecure={false}
    >
      {children}
    </AuthProvider>
  )
}

export default AuthProviderWrapper;