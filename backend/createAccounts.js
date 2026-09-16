const { User, Account } = require("./db");

async function createAccounts() {

    const users = await User.find();

    console.log("Total users:", users.length);

    for (const user of users) {

        const existingAccount = await Account.findOne({
            userId: user._id
        });

        if (existingAccount) {

            console.log(
                "Account already exists for:",
                user.username
            );

        } else {

            await Account.create({
                userId: user._id,
                balance: 10000
            });

            console.log(
                "Account created for:",
                user.username
            );
        }
    }

    console.log("Finished creating accounts");

    process.exit();
}

createAccounts();