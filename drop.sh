#Delete redis keys
echo "Droping redis keys"
redis-cli keys parkinglot* | xargs -n1 redis-cli del

echo "Droping parkings collection from mongo"
#Drop mongo db parking_lot
mongo parking_lot --eval "db.parkings.remove({})"
