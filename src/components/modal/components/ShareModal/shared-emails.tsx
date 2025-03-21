import { Button, Input } from "@heroui/react";
import { Mail } from "lucide-react";
import React, { Fragment } from "react";

type Props = {
	emails: string;
	setEmails: (value: string) => void;
	handleSendInvite: () => void;
};

const SharedEmails = ({ emails, setEmails, handleSendInvite }: Props) => {
	return (
		<Fragment>
			<div className="mb-6 flex items-center gap-2">
				<Input
					label=""
					placeholder="Email, comma separated"
					value={emails}
					onChange={(e) => setEmails(e.target.value)}
					className="flex-1"
					radius="full"
					startContent={
						<Mail
							size={16}
							className="pointer-events-none flex-shrink-0 text-default-400"
						/>
					}
				/>
				<Button
					className="bg-violet text-white"
					onPress={handleSendInvite}
					radius="full"
				>
					Send Invite
				</Button>
			</div>

			<div className="mb-6">
				<h3 className="mb-2 text-sm font-medium">Audience</h3>
				<div className="text-sm text-default-500">
					No users added yet
				</div>
			</div>
		</Fragment>
	);
};

export default SharedEmails;
