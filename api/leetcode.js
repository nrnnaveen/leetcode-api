export default async function handler(req, res) {
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({
      error: "Username required",
    });
  }

  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0",
    },
    body: JSON.stringify({
      query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            submitStats {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
      `,
      variables: {
        username,
      },
    }),
  });

  const json = await response.json();

  console.log(JSON.stringify(json, null, 2));

  return res.status(200).json(json);

  const stats =
    json?.data?.matchedUser?.submitStats?.acSubmissionNum;

  if (!stats) {
    return res.status(404).json({
      error: "User not found",
    });
  }

  const all = stats.find(
    (x) => x.difficulty === "All"
  );

  return res.status(200).json({
    totalSolved: all.count,
  });
}
