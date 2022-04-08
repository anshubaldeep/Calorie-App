import React from "react";
import { Paper, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const BarGraph = ({ data, title }) => {
return (
	<Paper
		sx={{
			justifyContent: "center",
			alignItems: "center",
			display: "flex",
			flexDirection: "column",
			gap: '1em',
			padding: "2rem 1rem 1rem 0rem",
		}}
	>
		<Typography variant="h5" component="h3">{title}</Typography>
		<ResponsiveContainer width="80%" height={400}>
			<BarChart data={data}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="argument" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Bar dataKey="value" fill="#1976D1" />
			</BarChart>
		</ResponsiveContainer>
	</Paper>
);
}

export default BarGraph;
