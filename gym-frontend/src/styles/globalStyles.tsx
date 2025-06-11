import { Global, css } from '@emotion/react';

const GlobalStyles = () => (
	<Global
		styles={css`
			html {
				font-family: 'Roboto', sans-serif;
				&::-webkit-scrollbar {
					width: 0.5rem;
					height: 0.5rem;
				}

				&::-webkit-scrollbar-track {
					background: #0e0e0e;
					border-radius: 0.25rem;
				}

				&::-webkit-scrollbar-thumb {
					background-color: #333;
					border-radius: 0.25rem;
					border: 0.1rem solid #0e0e0e;
				}
				&::-webkit-scrollbar-thumb:hover {
					background-color: #444;
					border-color: #000;
				}
				&::-webkit-scrollbar-button {
					display: none;
				}
				scroll-behavior: smooth;
			}

			body {
				font-family: 'Roboto', sans-serif;
				margin: 0;
				padding: 0;
				/* overflow: hidden; */
				/* background: #1d0722; */

				background-color: #f8fafc;
				color: #2a2c32;
			}
			span {
				font-family: inherit;
				font-size: inherit;
				color: inherit;
				font-weight: inherit;
			}
			a {
				text-decoration: none;
				color: inherit;
				font-size: inherit;
				/* &:hover {
					text-decoration: underline;
				} */
			}
		`}
	/>
);

export default GlobalStyles;
