const express = require('express')

const bodyParser = require('body-parser')
const DotEnv = require('dotenv')
const path = require('path')
const cors=require('cors')
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const connectToMongoDb = require('./config/Db')

const app = express();
DotEnv.config()
connectToMongoDb();

//***body parser */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(cookieParser())

app.use(flash());
app.use(session({
  cookie: {
      maxAge: 60000
  },
  secret: "anisha1234",
  resave: false,
  saveUninitialized: false
}));

// upload folder setup
app.use(express.static(path.join(__dirname,'public/Admin')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

//***cors */
app.use(cors());

// ejs file setup
app.set('view engine','ejs')
app.set('views','views')

const AdminAuth=require('./Middleware/adminVerify')
app.use(AdminAuth.jwtAuth)

// adminRouter setup
const adminRoute=require('./Route/AdminRoute')
app.use('/admin',adminRoute)


// apiRouter set up
const apiRoute=require('./Route/ApiRoute')
app.use(apiRoute)


// port setup
const Port = process.env.PORT || 7000;
app.listen(Port, () => {
  console.log(`Server running at http://localhost:${Port}`);
  console.log(`MongoDB URL: ${process.env.MONGO_URL}`);
});





