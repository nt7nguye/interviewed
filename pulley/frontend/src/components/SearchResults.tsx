import { useParams } from "react-router-dom";
import styles from "./SearchResults.module.css";
import { useState, useEffect } from "react";

interface SearchResult {
	position: number;
	title: string;
	link: string;
	displayed_link: string;
	snippet: string;
	favicon?: string;
	thumbnail?: string;
}

interface Message {
	id: string;
	role: string;
	text: string;
}

export default function SearchResults() {
	const { conversation_id } = useParams();
	const [messages, setMessages] = useState<Message[]>([]);

	useEffect(() => {
		if (!conversation_id) return;
		const fetchResults = async () => {
			const response = await fetch(
				`http://localhost:3000/conversation?conversation_id=${conversation_id}`,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			const data = await response.json();
			setMessages(data);
		};

		fetchResults();
	}, [conversation_id]);

	return (
		<div className={styles.container}>
			{messages.map((message) => (
				<div key={message.id}>
					{message.role === "user" ? (
						<h1>{message.text}</h1>
					) : (
						<p>{message.text}</p>
					)}
				</div>
			))}
		</div>
	);
}
