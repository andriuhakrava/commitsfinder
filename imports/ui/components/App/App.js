import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Commits } from '../../../api/commits.js';
import { CommitsByAuthor } from '../../../api/commits.js';
import { withTracker } from 'meteor/react-meteor-data';
import SearchForm from '../SearchForm/SearchForm.js';
import NewSearch from '../NewSearch/NewSearch.js';
import ResultsList from '../ResultsList/ResultsList.js';
import './App.css';

class App extends Component{
	state = {
		repositoryOwner: '',
		repositoryName: '',
		commitAuthor: '',
		showSearchForm: true,
		showSearchCommitAuthorForm: false,
		ruleStatus: false,
		errorMessage: ''
	}

	resetSearch = () => {
		localStorage.removeItem('repoowner');
		localStorage.removeItem('reponame');
		localStorage.removeItem('commitauthor');
		localStorage.removeItem('searchRepoForm');
		localStorage.removeItem('searchCommitAuthorForm');
		this.setState({
			repositoryOwner: '',
			repositoryName: '',
			commitAuthor: '',
			showSearchForm: true,
			showSearchCommitAuthorForm: false,
			ruleStatus: false,
			errorMessage: ''
		});
	}

	removeCommits = () => {
		Meteor.call('commits.remove');
		Meteor.call('commitsbyauthor.remove');
		this.resetSearch();
	}

	handleChange = (e) => {
		if (event.target.name === "commitAuthor") {
			this.setState({ 
				[event.target.name]: event.target.value.trim()
			});
		} 
		this.setState({ 
			[event.target.name]: event.target.value.toLowerCase().trim()
		});
	}

	toggleSearchForm = status => this.setState({ showSearchForm: status })
	toggleAuthorForm = status => this.setState({ showSearchCommitAuthorForm: status })

	toggleRule = () => this.setState({ ruleStatus: !this.state.ruleStatus })

	render() {
		const {
			ruleStatus,
			showSearchForm, 
			showSearchCommitAuthorForm, 
			repositoryOwner, 
			repositoryName,
			commitAuthor
		} = this.state;
		const { commits, commitsByAuthor } = this.props;
		return (
			<div>
				<NewSearch removeCommits={ this.removeCommits } />
				<h2 className="app-title">CommitsFinder</h2>
				<div className="rules-wrapper">
					<p className="rules" onClick={ this.toggleRule }>
						<a href="#">Click this info before start search</a>
					</p>
					{ 
						ruleStatus && 
						<p>For finding last commits from Github by author: type repository's owner and repository's name in the form fields below.
						Then choose some author name from results list and type it in the form field. If you want to try to find another commits by another author/repository, 
						<b>always</b> use button "New Search", it will start new search. 		
						</p>
					}
				</div>
					{ 
						showSearchForm && 
						<SearchForm searchMode="repo" 
							toggleSearchForm={ this.toggleSearchForm }
							toggleAuthorForm = { this.toggleAuthorForm }
							repositoryOwner={ repositoryOwner }
							repositoryName={ repositoryName }
							handleChange={ this.handleChange } /> 
					}
					{ 
						showSearchCommitAuthorForm && 
							<SearchForm searchMode="author" 
								toggleSearchForm={ this.toggleSearchForm }
								toggleAuthorForm = { this.toggleAuthorForm }
								commitAuthor={ commitAuthor }
								handleChange={ this.handleChange } /> }
				 	{ 
				 		commits && 
				 		<ResultsList commits={ commits } /> 
				 	}
		 			{ 
		 				commitsByAuthor && 
		 				<ResultsList commits={ commitsByAuthor } /> 
		 			}
			</div>
		)
	}
}

export default withTracker(() => {
 	Meteor.subscribe('commits');
 	Meteor.subscribe('commitsbyauthor');

 	return {
 		commits: Commits.find({}).fetch(),
 		commitsByAuthor: CommitsByAuthor.find({}).fetch()
 	};
})(App);
