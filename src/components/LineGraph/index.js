import React from "react"
import { Paper, Typography } from "@mui/material"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

function LineGraph({ data, title }) {
  return (
    <Paper
      sx={{
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        padding: "2rem 1rem 1rem 0rem",
        gap: "1em",
      }}
    >
      <Typography variant="h5" component="h3">
        {title}
      </Typography>
      <ResponsiveContainer width="80%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dateString" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="data" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  )
}

export default LineGraph
