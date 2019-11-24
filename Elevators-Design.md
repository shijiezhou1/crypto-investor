# Question 1 - Elevator Design System

##Introduction:

The traditional elevator use first come first serve in order to serve each passenger, although this is the fairest way to serve each passenger, but the problem is when there are a lot of people use the elevator at the same time, it becomes super slow, and some people have to wait until the elevator finish all task. For example, when a passenger A want to go up to the 100th floor, passenger B wants to go down from the 100th floor to the 1st floor, and passenger C wants to go up from the 1st floor to 5th floor. The passenger C will have to wait until A and B arrive before he can take the elevator. The goals of this system to shortest the waiting time for the passengers and balance out the time they have to wait.

Thus, the major issues are to balance the waiting time and order for passengers waiting outside the room and reduce the consumption of the energy when the elevators on ide time. This system can recognize individual passenger's needs and provide customized operation based on their unique requirements.

### Requirement

- The elevators will skip the floors when it is full.

Precondition:

1. There are total `4 elevators` presents and name it `A, B, C, D`.
2. The elevators can only go up and go down.
3. The elevators stop for `10 seconds`.
4. The elevators will spend `4 seconds` to traverse.
5. Peak hours data would be collected as the camera setups.
6. Each elevator will only have about `20 passengers` as the maximum number.
7. A total floor of `21 levels` will be in the building.
8. Each floor has a camera that monitoring on passengers with the number(including inside or outside the elevators
9. The camera tells the elevators to skip the floor previously the elevators traverse through the floor so it prevents the ghost call on the elevators.
10. The `1/4 elevators` will be the opposite direction, e.g. If the peak is morning, 3 of the elevators will be on the bottom, and only `1 elevators` will be on the top. Otherwise, 3 of the elevators will be on the top, and 1 on the bottom.
11. Each elevator may have 3 stops requests per elevators.

Main Flow:

1. Once the elevators start, it should detect the peak time of the day. Such as morning, or evening.
2. Dividing the elevators to three segments. `A only go from 1-7`, `B only go from 7-14`, `C only go from 14-21`. The D will be used as one direction, either up, or down based on the peak time, or for people with disabilities in case.
3. Each group of passengers stands in front of the elevators which indicates the segments of the floors it can go. such as `7-14 floors` on the LED light on the elevators.
4. Time of traverse:
 - Each elevator can traverse only 7 floors between, if people want to go up to the 7th floor from the 1st floor, the time complexity will be O(N) times, which it is `14 - 98 secs`. The more people want to stop on a certain floor, the more time it takes to complete the tasks.
 ```
 4 seconds(Traverse) * 7 + 10 seconds(IDE) * 7 = 98 seconds
 ```
 - if the passengers want to go from 7-14, it will be around `14 - 98 secs plus 28 secs(4 secs x 7 floors)`. each segment will cost 28 secs, passengers will spend much time on traverse but less waiting time compared to the elevator without organizing the group of the people
5. If 23 passengers are waiting outside such as A and no one else waiting on B, C, the segment of elevators needs to update as well. Thus, 20 of the passengers will go to A, and the rest of them will be suggested to use B, or C only when B and C are not on the operation. Otherwise, each elevator needs to run within its segment. This will maximize the usage of the elevators. The D elevators won't be used that much unless the emergent issue.
6. Each time elevators go up and down which consider finish one round trip, including goes down and goes up as well.
7. Problems of the edge case:
 - The passengers from the 21st floor want to go down, and the elevator just goes down. However, if the bottom floor has no request to 14-21 by the camera detection, the elevators should quick response back to the passengers on 21st floors.
 - The elevators only handle a maximum of 5 stops between each segment. As soon as the elevators past the segment, it shouldn't be coming back until the next trip. For example, the elevators pick up passengers 14-21th floors, and go down on 13th floors, it should not come back to any floor from 14-21th to pick up someone, so they have to wait until the elevator C fully goes down and come back to pick them up again. Another situation will be that 19 passengers on the 21st floor and 10 passengers on the 20th floor. The elevators will pick up one passenger and then keep going down. The passengers will be reminded with the time such as `4 * 20 floors * 2 times`, and it will be total 160 seconds waiting time show.

Postcodition:

- The passengers will arrive on their expecting floor with time spend O(N).
- The passenger's wait time will be more if it traverses between segment distance, and the time complexity will be O(N+M).
- The elevators A, B, C traverse from the segment and go one direction.

Conclusion:

The solution provides the capacity to solve problems, and decrease energy usage, move people faster and enhanced the passenger's experience. This system can save a lot of space and maintains the issue within each segment. The elevators will make a round trip by default and move people as a group instead of first come first serve pattern.
