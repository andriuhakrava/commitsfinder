import React from 'react';

const ResultsList = ({ commits }) => {
	checkHash = hash => {
		let regexp = /[0-9]$/;
		return regexp.test(hash);
	}

	renderResults = commits => {
		return commits.map(item => {
			return (
				<li key={ item._id } className={`commit ${this.checkHash(item.sha) ? 'commit-number' : '' }`}>
					{ item.author.login } commited at { moment(item.commit.author.date).format('ll') }
				</li>
			);
		});
	}

	return (
		<ul>
			{ 
				commits && 
				this.renderResults(commits) 
			}
		</ul>
	);
}

export default ResultsList;
