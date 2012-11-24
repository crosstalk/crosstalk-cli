crosstalk-cli
====

`crosstalk-cli` is a command-line interface for interacting with Crosstalk Swarm.

## Installation

### Current

    git clone git@github.com:crosstalk/crosstalk-cli.git
    cd crosstalk-cli
    npm link crosstalk-api-client
    npm link

### Future (pending npm release)

    npm install crosstalk-cli

## Usage

    Crosstalk CLI
    Valid commands are:

    crosstalk signup
    crosstalk account *
    crosstalk login [ACCOUNT_NAME]
    crosstalk logout
    crosstalk version
    crosstalk worker *

The `*` indicates nested commands. Typing `crosstalk account` or `crosstalk worker` will display help for commands. Furthermore, typing any command with `--help` flag, will display help information for that command.