# Budgeteer
This is a course requirements for CS191/192 Software Engineering Courses of the Department of Computer Science, College of Engineering, University of the Philippines, Diliman under the guidance of Ma. Rowena C. Solamo for AY 2022-2023.

Roel Francos Cagulada, 
Lara Angeline Punsalan, 
Ron Mikhael Surara, 
Sunny Sy

## How to Setup the Development Server

### Pre-requisites

First, ensure that [NodeJS](https://nodejs.org/en/download/releases/) is installed in your system. You can check this by running the following command in the terminal:

```bash
node --version
```

It should show at least version `v14`.

### Installing Dependencies

Once after pulling the codebase, install the dependencies by running the following command:

```bash
npm install
```

This will install the packages for both the frontend and the backend.

### Starting the Web App

To run the web app in development environment, just run the following command:

```bash
npm run dev
```

## How to push changes

### Pre-requisites

First, ensure that [Git](https://git-scm.com/) is installed in your system. You can check this by running the following command:

```bash
git --version
```

### Branches

For this project, we will be using numerous branches. Their usage are as follows:

- `main` - contains **stable** and **working** releases. **Never** push untested and buggy codes here. Make sure to update the app version whenever pushing here!

- `dev` - most of the major commits will be pushed here. Whenever you develop new features, use this branch or make a `topic` branch.

- `[topic]` - this is not required, but if you feel that you need to make a new branch while implementing a feature/fixing a bug, you can create a new branch. Just make sure to name the branch appropriately! (e.g., `ui-revamp`, `issue32`, `mobile-support`). As much as possible, do not upload topic branches in the online repository unless absolutely necessary.

To switch branches, use the following command:

```git
git switch <branch-name>
```

### Commit Messages

Keep the message short and in the [imperative mood](https://initialcommit.com/blog/Git-Commit-Message-Imperative-Mood) with the following format:

```bash
[commit-type] (server/client): [verb] ...
```

Use the following commit types:

- `feat` - when adding a new feature or implementing a major change

- `fix` - when fixing a bug

- `chore` - when adding minor changes or mundane tasks such as fixing a typo

- `refactor` - when performing major code refactor

- `doc` - when writing documentation or other non-code related changes

Examples:

- `feat (client): add sign-up page`

- `chore: remove semi-colons`

- `fix (server): encrypt password before storing in db`

### Pulling Reminder

To ensure that you're always modifying the latest version of the codebase, **pull regularly**! You can pull using the following command:

```bash
git pull
```