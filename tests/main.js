import chai from 'chai';
import assert from "assert";
import expect from 'expect';
import { shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'enzyme';
import { Factory } from 'meteor/dburles:factory';
import { Meteor } from 'meteor/meteor';
import React from 'react';
import SearchFormAuthor from '../imports/ui/components/SearchFormAuthor.js';

describe("github-finder", function () {
  it("package.json has correct name", async function () {
    const { name } = await import("../package.json");
    assert.strictEqual(name, "github-finder");
  });

  if (Meteor.isClient) {
    it("client is not server", function () {
      assert.strictEqual(Meteor.isServer, false);
    });
  }

  if (Meteor.isServer) {
    it("server is not client", function () {
      assert.strictEqual(Meteor.isClient, false);
    });
  }
  
  it("something that should be tested but i don't know how", function () {
    configure({ adapter: new Adapter() });
    TestCommits = new Meteor.Collection('testcommits');
    Factory.define('testcom', TestCommits);
    const testcommit = Factory.create('testcom', { 
      sha: "1sad123jsa1sad123jsa1sad123jsa1sad123jsa" 
    });
    let commitsByAuthorList = [testcommit];
    expect(commitsByAuthorList).toHaveLength(1);
  });
});
