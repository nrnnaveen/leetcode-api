export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const username = req.query.username;

  if (!username) {
    return res.status(400).json({
      error: "Username required",
    });
  }

  try {
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
              submitStats: submitStatsGlobal {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
            }
          }
        `,
        variables: { username },
      }),
    });

    const json = await response.json();

    const stats = json?.data?.matchedUser?.submitStats?.acSubmissionNum;

    if (!stats) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const all = stats.find(x => x.difficulty === "All");

    return res.status(200).json({
      totalSolved: all?.count ?? 0,
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
}
