import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import LoginForm from './LoginForm'

const EMAIL_PLACEHOLDER = /email/i
const PASSWORD_PLACEHOLDER = /password/i

test("loads properly", () => {
    render(<LoginForm />)

    expect(screen.getByPlaceholderText(EMAIL_PLACEHOLDER)).not.toBeNull()
    expect(screen.getByPlaceholderText(PASSWORD_PLACEHOLDER)).not.toBeNull()
})
