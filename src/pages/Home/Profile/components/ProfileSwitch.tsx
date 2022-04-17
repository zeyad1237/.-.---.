import Roact from "@rbxts/roact";
import { Spring } from "@rbxts/flipper";
import { pure } from "@rbxts/roact-hooked";
import { useDelayedEffect, useSingleMotor } from "@rbxts/roact-hooked-plus";

import Button from "components/Button";
import { CARD_INNER_MARGIN } from "constants";
import { DropshadowBlur } from "components/Dropshadow";
import { Page } from "store/pages";
import { ProfileState, toggleProfileSwitch } from "store/profile";
import { useRootDispatch, useRootSelector } from "hooks/use-root-store";
import { useTheme } from "hooks/use-theme";

const SWITCH_WIDTH = 61;
const SWITCH_HEIGHT = 49;

interface Props extends Roact.PropsWithChildren {
	index: number;
	key: keyof ProfileState["switches"];
	icon: string;
	position: UDim2;
}

function ProfileSwitch({ index, key, icon, position, [Roact.Children]: children }: Props) {
	const dispatch = useRootDispatch();

	const style = useTheme((theme) => theme.profile.switches[key]);
	const enabled = useRootSelector((state) => state.profile.switches[key].enabled);
	const visible = useRootSelector((state) => state.pages.visible && state.pages.currentPage === Page.Home);

	const [visibility, setGoal] = useSingleMotor(visible ? 1 : 0);
	useDelayedEffect(
		() => {
			setGoal(new Spring(visible ? 1 : 0, { frequency: 5 }));
		},
		visible ? 250 + index * 50 : 200,
		[visible],
	);

	// Position for show and hide transition
	const switchPosition = position;
	const switchPositionHidden = new UDim2(
		position.X,
		position.Y.add(new UDim(0, SWITCH_HEIGHT + CARD_INNER_MARGIN * 2)),
	);

	return (
		<>
			<Button.Root
				onClick={() => dispatch(toggleProfileSwitch(key, !enabled))}
				active={enabled}
				style={style}
				size={new UDim2(0, SWITCH_WIDTH, 0, SWITCH_HEIGHT)}
				position={visibility.map((n) => switchPositionHidden.Lerp(switchPosition, n))}
			>
				<Button.Shadow
					blur={DropshadowBlur.Medium}
					scale={0.75}
					size={new UDim2(1, 32, 1, 30)}
					position={new UDim2(0.5, 0, 1, 20)}
				/>
				<Button.Body />
				<Button.Icon image={icon} size={new UDim2(0, 36, 0, 36)} />

				{children}
			</Button.Root>
		</>
	);
}

export default pure(ProfileSwitch);