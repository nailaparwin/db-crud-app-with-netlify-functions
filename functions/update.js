const faunadb = require("faunadb"),
  q = faunadb.query

require("dotenv").config()

exports.handler = async (event) => {
  if (process.env.FAUNADB_SERVER_SECRET) {
  }
  try {
    var client = new faunadb.Client({
      secret: process.env.FAUNADB_ADMIN_SECRET,
    })
    let reqObj = JSON.parse(event.body)

    var result = await client.query(
      q.Update(q.Ref(q.Collection("students"), reqObj.id), {        
        data: { name: reqObj.name, age: reqObj.age, course: reqObj.course, gender: reqObj.gender},
      })
    )
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        id: `${result.ref.id}`,
        message: "update done",
      }),
    }
  } catch (error) {
    console.log("Error: ")
    console.log(error)
  }
}
