#!/usr/bin/env python
import json
import pymongo
from pymongo import MongoClient

TITLE_FILE_OFFSET = 1
line_offset = []
title_file = open('titles-sorted.txt', "rbq ", 8192)


def line_to_dict(line):
    article_link_int_components = line.split(' ')
    article_id = article_link_int_components[0][:-1]
    article_title = find_title_name_from_int(int(article_id))
    article_link_str_components = []
    for word in article_link_int_components[1:-1]:
        article_link_str_components.append(find_title_name_from_int(int(word)))
    return {'title': article_title, 'links': article_link_str_components[1:-1]}


def find_title_name_from_int(number):
    line_number = number - TITLE_FILE_OFFSET
    title_file.seek(line_offset[line_number])
    return title_file.readline()


def initialize_file_line_offsets():
    offset = 0
    for line in title_file:
        line_offset.append(offset)
        offset += len(line)
    title_file.seek(0)


def main():
    initialize_file_line_offsets()
    client = MongoClient('localhost', 27017)
    db = client['wikimapper']
    links = db.links
    # article_list = []
    print "Starting import..."
    with open('links-simple-sorted.txt') as infile:
        for line in infile:
            article_dict = line_to_dict(line)
            if len(article_dict.get('links')) != 0:
                links.insert(article_dict)
    print "Finished importing"


main()
