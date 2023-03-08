import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import SignupForm from './SignupForm'

const EMAIL_PLACEHOLDER = /email/i
const PASSWORD_PLACEHOLDER = "Password"
const CONFIRM_PASSWORD_PLACEHOLDER = "Confirm Password"
const BUTTON_NAME = /register/i

const SUCCESS = /success/i
const ERROR_FILL_UP = /fill up all the fields/i
const ERROR_WEAK_PASSWORD = /weak password/i
const ERROR_PASSWORD_NOT_SAME = /passwords inputted are not the same/i 

test('loads and has the required fields', () => {
    render(<SignupForm />)

    expect(screen.getByText(/email/i)).not.toBeNull()
    expect(screen.getByText("Password")).not.toBeNull()
    expect(screen.getByText("Confirm Password")).not.toBeNull()
    expect(screen.queryByText(/waw/i)).toBeNull()
})

test('requires email to be filled', async () => {
    render(<SignupForm />)

    await userEvent.type(await screen.findByPlaceholderText(PASSWORD_PLACEHOLDER), "Abc123$$")
    await userEvent.type(await screen.findByPlaceholderText(CONFIRM_PASSWORD_PLACEHOLDER), "Abc123$$")
    await userEvent.click(await screen.findByRole('button', { name: BUTTON_NAME }))

    expect(await screen.findByText(ERROR_FILL_UP)).toBeVisible()
})

test('requires password to be filled', async () => {
    render(<SignupForm />)

    await userEvent.type(await screen.findByPlaceholderText(EMAIL_PLACEHOLDER), "sample@gmail.com")
    await userEvent.type(await screen.findByPlaceholderText(CONFIRM_PASSWORD_PLACEHOLDER), "Abc123$$")
    await userEvent.click(await screen.findByRole('button', { name: BUTTON_NAME }))

    expect(await screen.findByText(ERROR_FILL_UP)).toBeVisible()
})

test('requires confirm password to be filled', async () => {
    render(<SignupForm />)

    await userEvent.type(await screen.findByPlaceholderText(EMAIL_PLACEHOLDER), "sample@gmail.com")
    await userEvent.type(await screen.findByPlaceholderText(PASSWORD_PLACEHOLDER), "Abc123$$")
    await userEvent.click(await screen.findByRole('button', { name: BUTTON_NAME }))

    expect(await screen.findByText(ERROR_FILL_UP)).toBeVisible()
})

describe("checks if the password is strong", () => {
    test('password must have uppercase', async () => {
        render(<SignupForm />)
    
        await userEvent.type(await screen.findByPlaceholderText(EMAIL_PLACEHOLDER), "sample@gmail.com")
        await userEvent.type(await screen.findByPlaceholderText(PASSWORD_PLACEHOLDER), "abc123$$")
        await userEvent.type(await screen.findByPlaceholderText(CONFIRM_PASSWORD_PLACEHOLDER), "abc123$$")
        await userEvent.click(await screen.findByRole('button', { name: BUTTON_NAME }))

        expect(await screen.findByText(ERROR_WEAK_PASSWORD)).toBeVisible()
    })

    test('password must have numbers', async () => {
        render(<SignupForm />)
    
        await userEvent.type(await screen.findByPlaceholderText(EMAIL_PLACEHOLDER), "sample@gmail.com")
        await userEvent.type(await screen.findByPlaceholderText(PASSWORD_PLACEHOLDER), "abcABC$$")
        await userEvent.type(await screen.findByPlaceholderText(CONFIRM_PASSWORD_PLACEHOLDER), "abcABC$$")
        await userEvent.click(await screen.findByRole('button', { name: BUTTON_NAME }))
        
        expect(await screen.findByText(ERROR_WEAK_PASSWORD)).toBeVisible()
    })

     test('password must have symbols', async () => {
        render(<SignupForm />)
    
        await userEvent.type(await screen.findByPlaceholderText(EMAIL_PLACEHOLDER), "sample@gmail.com")
        await userEvent.type(await screen.findByPlaceholderText(PASSWORD_PLACEHOLDER), "abc12312")
        await userEvent.type(await screen.findByPlaceholderText(CONFIRM_PASSWORD_PLACEHOLDER), "abc12312")
        await userEvent.click(await screen.findByRole('button', { name: BUTTON_NAME }))
        
        expect(await screen.findByText(ERROR_WEAK_PASSWORD)).toBeVisible()
    })   

})

test("checks if the confirm password is same as inputted password", async () => {
    render(<SignupForm />)

    await userEvent.type(await screen.findByPlaceholderText(EMAIL_PLACEHOLDER), "sample@gmail.com")
    await userEvent.type(await screen.findByPlaceholderText(PASSWORD_PLACEHOLDER), "Abc123$$")
    await userEvent.type(await screen.findByPlaceholderText(CONFIRM_PASSWORD_PLACEHOLDER), "Abc123$$1")
    await userEvent.click(await screen.findByRole('button', { name: BUTTON_NAME }))
    
    expect(await screen.findByText(ERROR_PASSWORD_NOT_SAME)).toBeVisible()
})

test("works properly", async () => {
    render(<SignupForm />)

    await userEvent.type(await screen.findByPlaceholderText(EMAIL_PLACEHOLDER), "sample@gmail.com")
    await userEvent.type(await screen.findByPlaceholderText(PASSWORD_PLACEHOLDER), "Abc123$$")
    await userEvent.type(await screen.findByPlaceholderText(CONFIRM_PASSWORD_PLACEHOLDER), "Abc123$$")
    await userEvent.click(await screen.findByRole('button', { name: BUTTON_NAME }))
    
    expect(await screen.findByText(SUCCESS)).toBeVisible()
})