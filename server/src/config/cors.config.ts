import { CorsOptions } from "cors";

const allowedOriginsCors = [
  "http://after-upload-done.vercel.app", //use env
  "http://localhost:5173",
  "http://192.168.1.104:5173/",
];

const corsOption: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (
      allowedOriginsCors.includes(origin) ||
      process.env.NODE_ENV === "development" ||
      origin.endsWith(".customDomain.com")
    ) {
      return callback(null, true); //change domain name
    }

    callback(new Error(`CORS blocked it : ${origin}`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  exposedHeaders: ["Content-Length", "X-Pagination", "Authorization"],
};

export default corsOption;
