#!/usr/bin/env bash

nohup ruby ./att/app.rb > app.log &
nohup ruby ./att/listener.rb > listener.log &

