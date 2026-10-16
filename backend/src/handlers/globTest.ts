import type { Request, Response } from 'express';

export class Check {
  public static check(req: Request, res: Response): void {
    res.send('test');
  }
  public static checkAdmin(req: Request, res: Response): void {
    res.send('I am admin');
  }
}
