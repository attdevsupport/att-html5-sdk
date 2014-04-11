#!/usr/bin/env bash

nohup ruby ./att/app.rb &
nohup ruby ./att/listener.rb &
