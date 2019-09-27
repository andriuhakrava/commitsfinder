import React, { Component, Fragment } from 'react';
import { Meteor } from 'meteor/meteor';
import { Commits } from '../../../api/commits.js';
import { CommitsByAuthor } from '../../../api/commits.js';
import { BASE_URL } from '../../constants.js';
import axios from 'axios';

class SearchForm extends Component {
	state = {
		errorMessage: false,
		showInput: true,
		showAuthorInput: false,
		searchMode: ''
	}

	componentDidMount() {
		if (this.props.searchMode === 'repo') this.setState({ searchMode: 'repo' });
		else if (this.props.searchMode === 'author') this.setState({ searchMode: 'author'	});
	}

	hideForm = () => {
		if (this.state.searchMode === 'repo') {
			this.props.toggleSearchForm(false);
			this.props.toggleAuthorForm(true);
			localStorage.setItem('searchRepoForm', false);
			localStorage.setItem('searchCommitAuthorForm', true);
		} else if (this.state.searchMode === 'author') {
			this.props.toggleAuthorForm(false);
			localStorage.setItem('searchCommitAuthorForm', false);
		}
	}

	handleSubmit = e => {
		e.preventDefault();
		const { searchMode } = this.state;
		const { repositoryOwner, repositoryName, commitAuthor } = this.props;
		const ourProps = [repositoryOwner, repositoryName, commitAuthor];
		const filteredProps = ourProps.filter(item => item !== undefined);

		if (searchMode === 'repo') {
			let repoownerURL = filteredProps[0];
			let reponameURL = filteredProps[1];
			let url = `${BASE_URL}/${repoownerURL}/${reponameURL}/commits?page=1&per_page=50`;
			
			localStorage.setItem('repoownerURL', JSON.stringify(repoownerURL));
			localStorage.setItem('reponameURL', JSON.stringify(reponameURL));

			axios.get(url, { headers: { "Content-Type": "application/json" } })
				.then(response => {
					this.hideForm();
					Meteor.call('commits.insert', response.data);
				})
				.catch(error => this.setState({ errorMessage: true }));
		}

		if (searchMode === 'author') {
			let commitauthorURL = filteredProps[0];
			let repoownerURL = JSON.parse(localStorage.getItem('repoownerURL'));
			let reponameURL = JSON.parse(localStorage.getItem('reponameURL'));
			let url = 
				`${BASE_URL}/${repoownerURL}/${reponameURL}/commits?page=1&per_page=50&author=${commitauthorURL}`;
			
			localStorage.setItem('commitauthorURL', JSON.stringify(commitauthorURL));

			axios.get(url, { headers: { "Content-Type": "application/json" } })
				.then(response => {
					this.hideForm();
					Meteor.call('commits.filter', commitauthorURL);
					Meteor.call('commits.remove');
				})
				.catch(error => this.setState({ errorMessage: true }));
		}
	}

	isButtonActive = (...params) => {
		let res = params.map(item => item.length > 0 ? true : false);
		for (let i = 0; i < res.length; i++) {
			if (res[i] === false || res[i + 1] === false) return true;
			else return false;
		}
	}
	
	render() {
		const { 
			searchMode, 
			repositoryOwner, 
			repositoryName, 
			commitAuthor, 
			handleChange 
		} = this.props;
		return (
			<div>
				<div className="form-wrapper">
					<form onSubmit={ this.handleSubmit }>
						{ 
							searchMode === 'repo' && (
							<Fragment>
								<input type="text" 
									placeholder="Type repository's owner"
									name="repositoryOwner"
									value={ repositoryOwner }
									onChange={ handleChange } /> 
								<input type="text" 
									placeholder="Type repository name"
									name="repositoryName" 
									value={ repositoryName }
									onChange={ handleChange } /> 
							</Fragment>
							)
						}
						{ 
							searchMode === 'author' && 
							<input type="text" 
								placeholder="Type commit's author"
								name="commitAuthor"
								value={ commitAuthor }
								onChange={ handleChange } /> 
						}
						<button className="btn-search" disabled={
							searchMode === "repo" ? 
							this.isButtonActive(repositoryOwner, repositoryName) :
							this.isButtonActive(commitAuthor) 
						}>
							Get Data!
						</button>
					</form>
					<div>
						{ 
							this.state.errorMessage && 
							'There are no such user or repository' 
						}
					</div>
				</div>
			</div>
		)	
	}
}

export default SearchForm;
