# Contributing to rgstry

Thank you for considering contributing to rgstry! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

Please be respectful and considerate of others when contributing to this project. We aim to foster an inclusive and welcoming community.

## How to Contribute

### Reporting Issues

If you find a bug or have a suggestion for improving rgstry:

1. First, check if the issue or suggestion has already been reported in the [Issues](https://github.com/duplessisvanaswegen/rgstry/issues) section.
2. If not, create a new issue, providing as much detail as possible:
   - For bugs: include steps to reproduce, expected behavior, actual behavior, and your environment (Node.js version, TypeScript version, etc.)
   - For feature requests: clearly explain the feature and its use case

### Pull Requests

We welcome pull requests! To contribute code:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Write and test your code
4. Ensure all tests pass with `npm test`
5. Ensure code meets style guidelines with `npm run lint`
6. Submit a pull request with a clear description of the changes

### Development Setup

To set up the project for development:

```bash
# Clone the repository
git clone https://github.com/duplessisvanaswegen/rgstry.git
cd rgstry

# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build
```

## Coding Guidelines

- Follow the TypeScript coding style used throughout the project
- Write tests for new features and bug fixes
- Update documentation when necessary
- Keep commits focused and with clear commit messages

## TypeScript Guidelines

- Use strict typing whenever possible
- Avoid the use of `any` except where absolutely necessary
- Include JSDoc comments for public APIs
- Keep backwards compatibility in mind

## Testing

- Write unit tests for new features using Jest
- Ensure all tests pass before submitting a pull request
- Consider adding test cases for edge cases

## Documentation

When adding new features, please update the relevant documentation:

- Update JSDoc comments in the code
- Update the README.md if necessary
- Consider updating or adding examples

## Release Process

The project maintainers will handle the release process, including:

- Version bumping following semantic versioning
- Release notes
- npm publishing

## Getting Help

If you need help or have questions:

- Open an issue with your question
- Reach out to the maintainers

Thank you for contributing to rgstry!
