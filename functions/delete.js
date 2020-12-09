const faunadb = require("faunadb"),
  q = faunadb.query

require("dotenv").config()

exports.handler = async (event, context) => {
  try {
    const client = new faunadb.Client({
      secret: process.env.FAUNADB_ADMIN_SECRET,
    })

    const reqId = JSON.parse(event.body)

    const result = await client.query(
      q.Delete(q.Ref(q.Collection("students"), reqId))
    )

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "student deleted",
      }),
    }
  } catch (error) {
    return { statusCode: 400, body: error.toString() }
  }
}
