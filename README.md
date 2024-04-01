
# PP overlay

This will allow you to add the amount of PP away from your desired rank or specific player depending on your target. 

As a user you will just need to add a browser source in OBS and add the following URLs

## URLs

| URL                                                                         | Perameters                                                                                        | Description |
| ---------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| batthew.co.uk:8081/toNum?SSid=1234&num=10                                                        | SSid - Your own scoresaber ID num - The target rank you want to achieve                                                                                | This will find the amount of PP it will take to overtake the player who is currently at that rank                                                                                                  |
| batthew.co.uk:8081/toPlayer?SSid=1234&targetSSid=10                                               | SSid - Your own scoresaber ID targetSSid - the Scoresaber ID of your target                                                                            | This will find the amount of PP it will take to overtake the player you specified                                                                                                                  |
| batthew.co.uk:8081/plusOne?SSid=1234                                                              | SSid - Your own scoresaber ID                                                                                                                          | This will find out how much raw PP it will take to gain 1 Weighted PP                                                                                                                              |

### Contributions
If you would like to build this for yourself then you are more than welcome to fork the repository and contribute. to build you just have to run npm i and tsc. If you have any questions, feel free to message me on discord (batthew)
