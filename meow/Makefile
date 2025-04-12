init-tigerbeetle:
	tigerbeetle/tigerbeetle format --cluster=0 --replica-count=3 --replica=0 tigerbeetle/0_0.tigerbeetle
	tigerbeetle/tigerbeetle format --cluster=0 --replica-count=3 --replica=1 tigerbeetle/0_1.tigerbeetle
	tigerbeetle/tigerbeetle format --cluster=0 --replica-count=3 --replica=2 tigerbeetle/0_2.tigerbeetle

start-tigerbeetle:
	tigerbeetle/tigerbeetle start --addresses=127.0.0.1:3001,127.0.0.1:3002,127.0.0.1:3003 tigerbeetle/0_0.tigerbeetle &
	tigerbeetle/tigerbeetle start --addresses=127.0.0.1:3001,127.0.0.1:3002,127.0.0.1:3003 tigerbeetle/0_1.tigerbeetle &
	tigerbeetle/tigerbeetle start --addresses=127.0.0.1:3001,127.0.0.1:3002,127.0.0.1:3003 tigerbeetle/0_2.tigerbeetle &

stop-tigerbeetle:
	killall tigerbeetle

