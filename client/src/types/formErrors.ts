export interface CredentialsError {
  email: string | undefined,
  password: string | undefined
}

export type AccountSetupError = CredentialsError & {
 confirm: string | undefined
}

export type AccountCreationError = {
  username: string | undefined,
  bio: string | undefined
}

export type PostCreationError = {
  content: string | undefined,
  image: string | undefined
}