import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LsGoalContainer } from "../atoms/LsGoalContainer";
import { Title } from "../atoms/Title";

type LsGoalProps = {
  streakName: string;
  onPress: () => void;
};

const LsGoal = ({ streakName, onPress }: LsGoalProps) => {
  return (
    <LsGoalContainer onPress={onPress}>
      <Title variant="med">{streakName}</Title>
      <MaterialCommunityIcons name="fire" size={30} color={"yellow"} />
    </LsGoalContainer>
  );
};

export { LsGoal };
