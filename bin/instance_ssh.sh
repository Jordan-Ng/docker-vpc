#!/bin/bash
before_pids=$(pgrep -x Terminal)

temp_script=$(mktemp /tmp/target_script.docker_ssh)
# start_instance_instruction="docker start -i $1"
start_instance_instruction="docker exec -it $1 /bin/bash"
welcome_prompt="echo 'connecting to instance $1 ..'"

# populating temp script
echo "#!/bin/bash" > "$temp_script"
echo "clear" >> "$temp_script"
echo $welcome_prompt >> "$temp_script"
echo $start_instance_instruction >> "$temp_script"
echo "$SHELL" >> "$temp_script"

chmod +x "$temp_script"
open -n -a Terminal "$temp_script"

echo "Terminal Process has started"
# allowing enough time for Terminal app to be spun up
sleep 3

after_pids=$(pgrep -x Terminal)

new_pid=$(comm -13 <(echo "$before_pids" | tr ' ' '\n' ) <(echo "$after_pids" | tr ' ' '\n' ))

sleep 1

# periodically poll running terminal application to see if still running
while :;
    do
        if ! kill -0 "$new_pid" &> /dev/null;
            then
                echo "Terminal Process has exited, initiating cleanup.."
                sleep 1

                # echo "Stopping $1..."            
                # docker stop $1 > /dev/null

                echo "Removing $1's temporary script..."
                sleep 1
                rm "$temp_script"

                echo "Returning back to main process"
                sleep 1

                break
            else
                echo "Terminal Process still running"
                sleep 3
        fi
    done

