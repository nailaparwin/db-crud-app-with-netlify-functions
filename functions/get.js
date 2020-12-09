const faunadb = require("faunadb"),
  q = faunadb.query

require("dotenv").config()

exports.handler = async (event, context) => {
  try {
    const client = new faunadb.Client({
      secret: process.env.FAUNADB_ADMIN_SECRET,
    })
console.log("progress")
    let result = await client.query(
      q.Map(
        q.Paginate(q.Match(q.Index("student_list"))),
        q.Lambda("x", q.Get(q.Var("x")))
      )
    )
    console.log("students list " + result.data.map(x => x.data.message))
    return {
      statusCode: 200,
      body: JSON.stringify(result.data),
    }
  } catch (error) {
    return { statusCode: 400, body: error.toString() }
  }
}
