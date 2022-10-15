import { NextFunction, Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import { CommonEnum } from "../enum/CommonEnum";

const AuthMiddleWare = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {    
    return res.status(401).send({reason :CommonEnum.NO_JWT_TOKEN});
  }
  jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any) => {   
    if (err) {
      return res.status(401).send({reason : CommonEnum.INVALID_TOKEN});
    }
    return next();
  });
  console.log(" == Middleware : JWT verification success == ");
  return next();
};

export default AuthMiddleWare;
