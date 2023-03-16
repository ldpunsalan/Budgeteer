import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import LoginForm from './LoginForm'

const EMAIL_PLACEHOLDER = /email/i
const PASSWORD_PLACEHOLDER = /password/i

// Mock the modules
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom')

    return {
        __esModule: true,
        ...originalModule,
        useNavigate: () => { return (e) => {} }
    }
})


test("loads properly", () => {
    render(<LoginForm />)

    expect(screen.getByPlaceholderText(EMAIL_PLACEHOLDER)).not.toBeNull()
    expect(screen.getByPlaceholderText(PASSWORD_PLACEHOLDER)).not.toBeNull()
})
