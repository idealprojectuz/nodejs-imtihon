const express = require("express");
const bcrypt = require( "bcrypt" );
const jwt = require( "jsonwebtoken" );
/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
module.exports = async (req, res) => {
  try {
    const { email, password } = req.body;
    const check = await bcrypt.compare(password, req.users.password);
      if ( check ) {
          const token=jwt.sign(
            {
              id: req.users.id,
              role: req.users.role,
            },
              process.env.SECRET_KEY, { expiresIn: '24h' } );
          res.status(200).json({
            status: 200,
            token,
          } );
          return
      }
      throw new Error(true)
  } catch ( error ) {
      res.status( 401 ).json( { status: 401, message: "email or password incorrect" } )
  }
};
