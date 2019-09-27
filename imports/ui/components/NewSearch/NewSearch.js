import React from 'react';

const NewSearch = ({ removeCommits }) => (
	<button className="btn-newsearch" onClick={ removeCommits }>
		New Search
	</button>
);

export default NewSearch;
