const mongoose = require('mongoose')

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("mongoDb connecté")
    }
    catch(error) {

        console.log("erreur mongoDb", error)
        process.exit(1)
    }

}

module.exports=connectDb