import { Drawer } from "@/components/Drawer";
import { CheckoutDisplay } from "@/components/CheckoutDisplay";
import type { DartScore } from "@/utils/darts";

interface CheckoutDrawerProps {
  score: number | null;
  onClose: () => void;
  getRoute: (
    score: number,
    dartsInHand: 1 | 2 | 3
  ) => {
    route: DartScore[];
    isCustom: boolean;
  };
  onEdit: (score: number, dartsInHand: 1 | 2 | 3, route: DartScore[]) => void;
}

export const CheckoutDrawer = ({
  score,
  onClose,
  getRoute,
  onEdit,
}: CheckoutDrawerProps) => {
  if (score === null) return null;

  return (
    <Drawer
      isOpen={true}
      onClose={onClose}
      title={`Checkout Routes for ${score}`}
    >
      <div className="space-y-1.5">
        <CheckoutDisplay
          score={score}
          dartsInHand={3}
          route={getRoute(score, 3).route}
          isCustom={getRoute(score, 3).isCustom}
          onEdit={(route) => onEdit(score, 3, route)}
        />
        <CheckoutDisplay
          score={score}
          dartsInHand={2}
          route={getRoute(score, 2).route}
          isCustom={getRoute(score, 2).isCustom}
          onEdit={(route) => onEdit(score, 2, route)}
        />
        <CheckoutDisplay
          score={score}
          dartsInHand={1}
          route={getRoute(score, 1).route}
          isCustom={getRoute(score, 1).isCustom}
          onEdit={(route) => onEdit(score, 1, route)}
        />
      </div>
    </Drawer>
  );
};
