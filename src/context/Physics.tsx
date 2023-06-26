import r from "@dimforge/rapier2d";
import { MotionValue } from "framer-motion";
import { createContext, useContext, useEffect, useRef } from "react";
import { useAsset } from "use-asset";
import { useConst } from "../hooks/useConst";

export const toRad = (deg: number) => deg * (Math.PI / 180);
export const toDeg = (rad: number) => rad * (180 / Math.PI);

export { r };

const importRapier = async () => {
  const r = await import("@dimforge/rapier2d");
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  return r;
};

export interface PhysicsBody {
  motionValues: {
    x: MotionValue<number>;
    y: MotionValue<number>;
    rotateZ: MotionValue<number>;
  };
  ref: React.RefObject<HTMLElement>;
  rigidBody: r.RigidBody;
  originalPosition: {
    rotation: number;
    x: number;
    y: number;
  };
}

interface PhysicsContext {
  bodies: Map<r.RigidBodyHandle, PhysicsBody>;
  world: r.World;
  rapier: typeof r;
}

const PhysicsContext = createContext<PhysicsContext | undefined>(undefined);

export const colliderFromElement = (
  elementRef: HTMLElement,
  rapier: typeof r
) => {
  const rect = elementRef.getBoundingClientRect();
  const style = window.getComputedStyle(elementRef);

  const borderRadius = parseInt(style.borderRadius || "0");

  if (borderRadius > 0) {
    return rapier.ColliderDesc.roundCuboid(
      rect.width / 2 - borderRadius,
      rect.height / 2 - borderRadius,
      borderRadius
    );
  }

  return rapier.ColliderDesc.cuboid(rect.width / 2, rect.height / 2);
};

export const elementScreenPosition = (elementRef: HTMLElement) => {
  const rect = elementRef.getBoundingClientRect();

  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  };
};

interface RapierProps {
  children?: React.ReactNode | React.ReactNode[];
  gravity?: { x?: number; y?: number };
}

export const Physics = ({ children, gravity }: RapierProps) => {
  const rapier = useAsset(importRapier);

  const world = useConst(() => {
    const world = new rapier.World({ x: gravity?.x || 0, y: gravity?.y || 0 });
    return world;
  });

  useEffect(() => {
    world.gravity = {
      x: gravity?.x || gravity?.x || 0,
      y: gravity?.y || gravity?.y || 0,
    };
  }, [gravity]);

  const bodies = useConst<PhysicsContext["bodies"]>(new Map());

  const worldRunning = useRef(false);

  useEffect(() => {
    if (!worldRunning.current) {
      const loop = () => {
        world.step();

        for (const [_, body] of bodies) {
          const position = body.rigidBody.translation();
          const rotation = body.rigidBody.rotation();

          body.motionValues.x.set(position.x - body.originalPosition.x);
          body.motionValues.y.set(position.y - body.originalPosition.y);
          body.motionValues.rotateZ.set(toDeg(rotation));
        }
        requestAnimationFrame(loop);
      };

      loop();
      worldRunning.current = true;
    }
  }, [bodies, world]);

  return (
    <PhysicsContext.Provider
      value={{
        bodies: bodies,
        rapier: rapier,
        world: world,
      }}
    >
      {children}
    </PhysicsContext.Provider>
  );
};

export const usePhysics = () => {
  const context = useContext(PhysicsContext);
  if (context === undefined) {
    throw new Error("useRapier must be used within a Rapier");
  }
  return context;
};
