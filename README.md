crosstalk-cli
====

`crosstalk-cli` is a command-line interface for interacting with Crosstalk Swarm.

## Security Notice

While Crosstalk is in the current _alpha_ development stage, it's messages are being heavily logged for debugging purposes. If you create an account, please **DO NOT** provide a password that you cannot afford to make known to me.

Naturally, this will not be the case as Crosstalk matures. 

Aside from the above consideration, your passwords are being securely one-way hashed using thousands of iterations of cryptographic one-way hash with individual and application-wide salt components. 

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

## Sessions

After you login using `crosstalk login [ACCOUNT_NAME]` the Crosstalk session token will be saved in your configuration file `config/config.json` under field `crosstalkToken`. When you logout via `crosstalk logout`, the token will be deleted.