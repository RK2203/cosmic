"use client";

import { Skeleton } from "primereact/skeleton";
import { useState } from "react";

export default function Loading({ src }) {
	const [loading, setLoading] = useState(true);

	return (
		<>
			{loading && (
				<Skeleton
					height="10rem"
					animation="wave"
					className="max-w-full p-skeleton rounded-lg skele"
				/>
			)}

			<img
				className={`h-40 max-w-full rounded-lg `}
				src={src}
				alt=""
				loading="lazy"
				onLoad={() => setLoading(false)}
			/>
		</>
	);
}
