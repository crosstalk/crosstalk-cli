crosstalk-cli
====

`crosstalk-cli` is a command-line interface for interacting with Crosstalk Swarm.

## Security Notice

While Crosstalk is in the current _alpha_ development stage, it's messages are being heavily logged for debugging purposes. If you create an account, please **DO NOT** provide a password that you cannot afford to make known to me.

Naturally, this will not be the case as Crosstalk matures. 

Aside from the above consideration, your passwords are being securely one-way hashed using thousands of iterations of cryptographic one-way hash with individual and application-wide salt components. 

## Installation

    npm install -g crosstalk-cli

## Usage

    ~$ crosstalk --help

    Crosstalk CLI
    Valid commands are:

    crosstalk signup
    crosstalk activate
    crosstalk account *
    crosstalk login [ACCOUNT_NAME]
    crosstalk logout
    crosstalk version
    crosstalk worker *

The `*` indicates nested commands. Typing `crosstalk account` or `crosstalk worker` will display help for commands. Furthermore, typing any command with `--help` flag, will display help information for that command.

## Signup

    ~$ crosstalk signup
    info:    Preparing to create a Crosstalk account...
    help:    You can also provide ACCOUNT_NAME as the first param.
    help:    crosstalk account create [ACCOUNT_NAME]
    prompt: Enter account name: tristan
    prompt: Enter your email address: tristan@crxtalk.com
    warn:    *** SECURITY NOTICE ***
    warn:    While Crosstalk is in the current alpha development stage,
    warn:    it's messages are being heavily logged for debugging purposes.
    warn:    For now, please DO NOT provide a password that you cannot
    warn:    make known to Crosstalk.
    warn:    In the future, this will no longer be the case.
    prompt: Enter your password:
    prompt: Confirm your password:
    info:    Creating account for tristan
    info:    Account created for tristan
    help:    See also:
    help:    crosstalk login to login
    help:    crosstalk logout to logout
    info:    Crosstalk OK
    
## Activation

While Crosstalk is in alpha preview, new accounts will need to be activated once you receive an activation token.

    ~$ crosstalk activate
    help:    You can also provide ACCOUNT_NAME as the first param.
    help:    crosstalk account activate [ACCOUNT_NAME] [ACTIVATION_TOKEN]
    prompt: Enter account name: tristan
    help:    You can also provide ACTIVATION_TOKEN as the second param.
    help:    crosstalk account activate [ACCOUNT_NAME] [ACTIVATION_TOKEN]
    prompt: Enter activation token: 5c7b6ef4dda8bbe73ced92797ae7...
    info:    Activating tristan
    info:    Account tristan is now active
    help:    See also:
    help:    crosstalk login to login
    help:    crosstalk signup to signup
    info:    Crosstalk OK
    
## Sessions

After you login using `crosstalk login [ACCOUNT_NAME]` the Crosstalk session token will be saved in your configuration file specified by `$CROSSTALK_CONFIG` (if defined), otherwise `~/.crosstalk.config`, under field `crosstalkToken`. When you logout via `crosstalk logout`, the token will be deleted.
