import { Mongo } from 'meteor/mongo';

export const Commits = new Mongo.Collection('commits');
export const CommitsByAuthor = new Mongo.Collection('commitsbyauthor');

if (Meteor.isServer) {
	Meteor.publish('commits');
	Meteor.publish('commitsbyauthor');
}

Meteor.methods({
	'commits.insert'(data) {
		data.forEach(item => Commits.insert(item));
	},
	'commits.remove'() {
		Commits.remove({});
	},
	'commitsbyauthor.remove'() {
		CommitsByAuthor.remove({});
	},
	'commits.filter'(queryAuthor) {
		let filteredByAuthor = Commits.find({ "author.login": queryAuthor }).fetch();
		filteredByAuthor.forEach(item => CommitsByAuthor.insert(item));
	}
});
