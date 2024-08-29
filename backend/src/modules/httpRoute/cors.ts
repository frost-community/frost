import express from "express";

export function corsApi(): express.RequestHandler {
  return (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    // preflight request
    if (req.method == 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', 'POST,GET,DELETE,OPTIONS');
      res.setHeader("Access-Control-Allow-Headers", "Accept,Content-Type,Origin,Authorization");
      res.setHeader("Access-Control-Max-Age", "60");
      return res.status(204).send();
    }

    next();
  };
}
