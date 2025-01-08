import { CreditCard, Github, LifeBuoy, LogOut, Settings, User } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ENDPOINTS from "@/services/api/EndPoints";

const ProfileDropDown = ({ user }: { user: TSuccessAPIResponse<any> }) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar>
					<AvatarImage src="https://github.com/shadcn.png" />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<User className="mr-2 h-4 w-4" />
						<span>Profile</span>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<CreditCard className="mr-2 h-4 w-4" />
						<span>Billing</span>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Settings className="mr-2 h-4 w-4" />
						<span>Settings</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<Github className="mr-2 h-4 w-4" />
					<span>GitHub</span>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<LifeBuoy className="mr-2 h-4 w-4" />
					<span>Support</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className="text-red-500 focus:bg-red-100 focus:text-red-500"
					onClick={handleLogout}
				>
					<LogOut className="mr-2 h-4 w-4" />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ProfileDropDown;

const handleLogout = async () => {
	try {
		const logoutUrl = ENDPOINTS.LOGOUT();
		const response = await fetch("/api" + logoutUrl);
		if (!response.ok) {
			throw new Error(`Logout failed with status: ${response.status}`);
		}

		await response.json();

		// redirect to home page
		location.href = "/";
	} catch (error) {
		console.error("Error:", error);
	}
};
