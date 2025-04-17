init-tigerbeetle:
	tigerbeetle_db/tigerbeetle format --cluster=0 --replica-count=3 --replica=0 tigerbeetle_db/0_0.tigerbeetle
	tigerbeetle_db/tigerbeetle format --cluster=0 --replica-count=3 --replica=1 tigerbeetle_db/0_1.tigerbeetle
	tigerbeetle_db/tigerbeetle format --cluster=0 --replica-count=3 --replica=2 tigerbeetle_db/0_2.tigerbeetle

start-tigerbeetle:
	tigerbeetle_db/tigerbeetle start --addresses=127.0.0.1:3001,127.0.0.1:3002,127.0.0.1:3003 tigerbeetle_db/0_0.tigerbeetle &
	tigerbeetle_db/tigerbeetle start --addresses=127.0.0.1:3001,127.0.0.1:3002,127.0.0.1:3003 tigerbeetle_db/0_1.tigerbeetle &
	tigerbeetle_db/tigerbeetle start --addresses=127.0.0.1:3001,127.0.0.1:3002,127.0.0.1:3003 tigerbeetle_db/0_2.tigerbeetle

stop-tigerbeetle:
	killall tigerbeetle

# Initialize treasury account with 10 billion dollars
init-treasury:
	poetry run -- python init_treasury.py
